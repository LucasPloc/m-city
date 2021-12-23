import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../hoc/AdminLayout";
import { limit, query, getDocs, collection, DB } from "../../firebase";
import { startAfter } from "@firebase/firestore";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { showToastError, showToastSuccess } from "../../components/utils/tools";

const AdminPlayers = () => {
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    if (!players) {
      setLoading(true);
      getData();
    }
  }, [players]);

  const getData = async () => {
    try {
      const q = await query(collection(DB, "players"), limit(2));
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const players = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLastVisible(lastVisible);
      setPlayers(players);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return;
    }
  };

  const loadMorePlayers = async () => {
    if (lastVisible) {
      setLoading(true);
      try {
        const q = await query(
          collection(DB, "players"),
          startAfter(lastVisible),
          limit(2)
        );
        const querySnapshot = await getDocs(q);
        const newLastVisible =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        const newPlayers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLastVisible(newLastVisible);
        setPlayers([...players, ...newPlayers]);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showToastError(err);
        return;
      }
    } else {
      showToastError("Nothing to load");
      return;
    }
  };

  return (
    <AdminLayout title="The players">
      <div className="mb-5">
        <Button
          disableElevation
          variant="outlined"
          to="/admin-players/add-player"
          component={Link}
        >
          Add player
        </Button>
      </div>
      <Paper className="mb-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players
              ? players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <Link to={`/admin-players/edit-player/${player.id}`}>
                        {player.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin-players/edit-player/${player.id}`}>
                        {player.lastname}
                      </Link>
                    </TableCell>
                    <TableCell>{player.number}</TableCell>
                    <TableCell>{player.position}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={() => loadMorePlayers()}
        disabled={loading}
      >
        Load more
      </Button>
      <div className="admin_progress">
        {loading ? (
          <CircularProgress
            thickness={7}
            style={{
              color: "#98c5e9",
            }}
          />
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminPlayers;
