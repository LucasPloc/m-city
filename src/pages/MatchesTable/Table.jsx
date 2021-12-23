import { useEffect, useState } from "react";
import { showToastError } from "../../components/utils/tools";
import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { query, collection, getDocs, DB } from "../../firebase";

const MatchTable = () => {
  const [positions, setPositions] = useState(null);

  useEffect(() => {
    if (!positions) {
      const takePositions = async () => {
        try {
          const q = await query(collection(DB, "positions"));
          const querySnapshot = await getDocs(q);
          const position = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPositions(position);
        } catch (err) {
          showToastError(err);
        }
      };
      takePositions();
    }
  }, [positions]);

  const showTeamPositions = () =>
    positions
      ? positions.map((position, i) => (
          <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{position.team}</TableCell>
            <TableCell>{position.w}</TableCell>
            <TableCell>{position.d}</TableCell>
            <TableCell>{position.l}</TableCell>
            <TableCell>{position.pts}</TableCell>
          </TableRow>
        ))
      : null;

  return (
    <div className="league_table_wrapper">
      <div className="title">League Table</div>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>W</TableCell>
              <TableCell>L</TableCell>
              <TableCell>D</TableCell>
              <TableCell>Pts</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{showTeamPositions()}</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MatchTable;
