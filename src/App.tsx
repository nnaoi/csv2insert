import React, { useState } from 'react';

import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormControlLabel, 
  Switch, 
  TextField 
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useSnackbar } from 'material-ui-snackbar-provider'
import { readString } from 'react-papaparse';
import PapaParse from 'papaparse';

function App() {
  const snackbar = useSnackbar();
  const [csvText, setCsvText] = useState('');
  const [insertText, setInsertText] = useState('');
  const [isCopyChecked, setCopyChecked] = useState(true);

  const csvToInsert = () => {
    const tables = csvText.replace(/\t+?\r?\n/g, '\n')
      .split(/^\r?\n/m);
    let sqlStateMent = '';
    tables.forEach(table => {
      const regex = /^.+?\r?\n/;
      const tableName = table.match(regex)
        ?.find(tn => tn)
        ?.replace(/\r?\n/, '');
      table = table.replace(regex, '').replace(/\r?\n\t*?$/, '');
      sqlStateMent += `-- ${tableName}\n`;

      const result = readString(table, { header: true }) as 
        PapaParse.ParseResult<{[column: string]: string}>;
      result.data.forEach(row => {
        const columns = Object.keys(row);
        const values = Object.values(row)
          .map(v => v === 'NULL' ? 'NULL' : `'${v}'`)
          sqlStateMent += `INSERT INTO ${tableName}(${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
      });

      sqlStateMent += 'GO\n\n';
    });

    setInsertText(sqlStateMent);
    if (isCopyChecked && navigator.clipboard) {
      navigator.clipboard.writeText(sqlStateMent);
      snackbar.showMessage('コピーしました。');
    }
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
                onClick={() => csvToInsert()}
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
