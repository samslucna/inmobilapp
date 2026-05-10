import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import userStore from "../../store/UserStore";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchInput from "./SearchInput";
import Form from "./Form";
import TableData from "./TableData";

const UserList = observer(() => {
  useEffect(() => {
    userStore.loadUsers();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
        
        </Typography>
        <SearchInput/>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {userStore.hiddenForm ? (
            <Grid size={12}>
              <Form />
            </Grid>
          ) : 
           <Grid size={12}>
            <TableData datas={userStore.users} />
          </Grid>
          }

         
        </Grid>
      </Box>
    </>
  );
});

export default UserList;
