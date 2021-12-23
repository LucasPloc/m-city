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

const AdminMatches = () => {
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    if (!matches) {
      setLoading(true);
      getData();
    }
  }, [matches]);

  const getData = async () => {
    try {
      const q = await query(collection(DB, "matches"), limit(2));
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const matches = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLastVisible(lastVisible);
      setMatches(matches);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return;
    }
  };

  const loadMoreMatches = async () => {
    if (lastVisible) {
      setLoading(true);
      try {
        const q = await query(
          collection(DB, "matches"),
          startAfter(lastVisible),
          limit(2)
        );
        const querySnapshot = await getDocs(q);
        const newLastVisible =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        const newMatches = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLastVisible(newLastVisible);
        setMatches([...matches, ...newMatches]);
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
    <AdminLayout title="The matches">
      <div className="mb-5">
        <Button
          disableElevation
          variant="outlined"
          to="/admin-matches/add-match"
          component={Link}
        >
          Add Match
        </Button>
      </div>
      <Paper className="mb-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Match</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches
              ? matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>
                      <Link to={`/admin-matches/edit-match/${match.id}`}>
                        {match.away} <strong>-</strong> {match.local}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {match.resultAway} <strong>-</strong> {match.resultLocal}
                    </TableCell>
                    <TableCell>
                      {match.final === "Yes" ? (
                        <span className="matches_tag_red">Final</span>
                      ) : (
                        <span className="matches_tag_green">
                          Not played yet
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={() => loadMoreMatches()}
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

export default AdminMatches;
