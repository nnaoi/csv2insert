import { Box, Button, Card, CardActions, CardContent, Checkbox, Fab, FormControlLabel, FormGroup, Switch, TextField } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import React, { useState } from 'react';

function App() {
  const [csvText, setCsvText] = useState('');
  const [insertText, setInsertText] = useState('');
  const [isCopyChecked, setCopyChecked] = useState(true);

  const csvToInert = () => {
    const textWithExtraTabsRemoved = csvText.replace(/\t+?\r?\n/g, '\r\n');
  };

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
            value={csvText}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => setCsvText(e.target.value) }
          />
          <Box m={1} textAlign="center">
              <Button color="primary" 
                variant="contained"
                onClick={() => csvToInert()}
              >
                <KeyboardArrowDownIcon fontSize="large" />
              </Button>
              <FormControlLabel
                control={
                  <Switch 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCopyChecked(e.target.checked)} 
                    checked={isCopyChecked} 
                  />}
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
      </Card>
    </div>
  );
}

export default App;
