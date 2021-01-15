import { Box, Button, Card, CardContent, FormControlLabel, Switch, TextField } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import React, { useState } from 'react';

function App() {
  const [csvText, setCsvText] = useState('');
  const [insertText, setInsertText] = useState('');
  const [isCopyChecked, setCopyChecked] = useState(true);

  const csvToInert = () => {
    const textWithExtraTabsRemoved = csvText.replace(/\t+?\r?\n/g, '\r\n');
    const rows = textWithExtraTabsRemoved
      .split('\r\n')
      .map(r => r.split('\t'));
    let tableName: string;
    let tableNameIndex = 0;
    let columns: string[];
    let columnsIndex = 1;
    let insertText = "";
    rows.forEach((r, i) => {
      if (i === tableNameIndex) {
        tableName = r[0];
        columnsIndex = i + 1;
        insertText += `-- ${tableName}\r\n`;
      } else if (i === columnsIndex) {
        columns = r;
      } else if (r.length === 1 && !r[0]) {
        insertText += "GO\r\n\r\n";
        tableNameIndex = i + 1;
      } else {
        const rowWithQuotes = r
          .map(t => t === 'NULL' ? 'NULL' : `'${t}'`);
        insertText += `INSERT INTO ${tableName}(${columns.join(', ')}) VALUES (${rowWithQuotes.join(',')});\r\n`;
      }
    });
  
    insertText += 'GO'
    setInsertText(insertText);
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
            variant="filled"
            fullWidth
            value={csvText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCsvText(e.target.value) }
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
            value={insertText}
            variant="filled"
            fullWidth
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
