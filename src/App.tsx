import { Box, Button, Card, CardActions, CardContent, Checkbox, Fab, FormControlLabel, FormGroup, Switch, TextField } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Card>
        <CardContent>
          <TextField
            label="csv"
            multiline
            rows={4}
            rowsMax={10}
            defaultValue="Default Value"
            variant="filled"
            fullWidth
          />
          <Box m={1} textAlign="center">
              <Button color="primary" variant="contained">
                <KeyboardArrowDownIcon fontSize="large" />
              </Button>
              <FormControlLabel
                control={<Switch />}
                label="クリップボードにコピー"
                style={{ marginLeft: "4px" }}
              />
          </Box>
          <TextField
            label="INSERT"
            multiline
            rows={4}
            rowsMax={10}
            defaultValue="Default Value"
            variant="filled"
            fullWidth
          />
        </CardContent>
        <CardActions>
          
          <Checkbox />
        </CardActions>
      </Card>
    </div>
  );
}

export default App;
