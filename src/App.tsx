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

const CsvDefaultValue = `Users			
Id	Name		
11111	Mike		
22222	Susan		
33333	Bob		
			
MailAddresses			
Id	UserId	MailAddress	
11111	11111	mike@example.com	
22222	22222	susan@example.com	
33333	33333	bob@example.com	
      `;
const InsertDefaultValue = `-- Users
INSERT INTO Users(Id, Name) VALUES ('11111', 'Mike');
INSERT INTO Users(Id, Name) VALUES ('22222', 'Susan');
INSERT INTO Users(Id, Name) VALUES ('33333', 'Bob');
GO

-- MailAddresses
INSERT INTO MailAddresses(Id, UserId, MailAddress) VALUES ('11111', '11111', 'mike@example.com');
INSERT INTO MailAddresses(Id, UserId, MailAddress) VALUES ('22222', '22222', 'susan@example.com');
INSERT INTO MailAddresses(Id, UserId, MailAddress) VALUES ('33333', '33333', 'bob@example.com');
GO

`;
      
function App() {
  const snackbar = useSnackbar();
  const [csvText, setCsvText] = useState(CsvDefaultValue);
  const [insertText, setInsertText] = useState(InsertDefaultValue);
  const [isCopyChecked, setCopyChecked] = useState(true);

  const csvToInsert = () => {
    const tables = csvText.replace(/\t+?\r\n/g, '\r\n')
      .split(/^\r\n/m);
    let sqlStateMent = '';
    tables.forEach(table => {
      const regex = /^.+?\r\n/;
      const tableName = table.match(regex)
        ?.find(tn => tn)
        ?.replace(/\r\n/, '');
      table = table.replace(regex, '').replace(/\s*?$/g, '');
      sqlStateMent += `-- ${tableName}\r\n`;

      const result = readString(table, { header: true }) as 
        PapaParse.ParseResult<{[column: string]: string}>;
      result.data.forEach(row => {
        const columns = Object.keys(row);
        const values = Object.values(row)
          .map(v => v === 'NULL' ? 'NULL' : `'${v}'`)
          sqlStateMent += `INSERT INTO ${tableName}(${columns.join(', ')}) VALUES (${values.join(', ')});\r\n`;
      });

      sqlStateMent += 'GO\r\n\r\n';
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
