# A_COMMENT Program Documentation

## 1. Program Purpose

`A_COMMENT` is a lightweight import/export utility for robot controller comments and user data.

It supports the following item types:

- R / SR / PR
- DI / DO
- RI / RO
- AI / AO
- GI / GO
- F
- M
- UALM

The tool can:

- Export comments and values to a CSV file
- Import comments and values from a CSV file

---

## 2. Program Features

### Export
The program exports controller data into a CSV file named:

```text
RobotComment.CSV
```

Supported storage devices:

- Memory Card: `MC:\`
- USB Disk: `UD1:\`
- USB on TP: `UT1:\`

### Import
The program reads the same CSV format and writes the content back into controller memory.

---

## 3. Supported Data Types

| Type | Meaning |
|---|---|
| `R` | Numeric Register |
| `SR` | String Register |
| `PR` | Position Register |
| `DI` | Digital Input |
| `DO` | Digital Output |
| `RI` | Robot Input |
| `RO` | Robot Output |
| `AI` | Analog Input |
| `AO` | Analog Output |
| `GI` | Group Input |
| `GO` | Group Output |
| `F` | Flag |
| `M` | Marker |
| `UALM` | User Alarm |

---

## 4. Main Constants

| Constant | Meaning |
|---|---|
| `TERM` | CSV terminator string |
| `SPLIT` | CSV delimiter |
| `MAX_CMD` | Number of supported command types |

---

## 5. CSV File Format

The exported CSV file contains records in the following structure:

```text
TYPE,INDEX,COMMENT,VALUE,TERM
```

Different item types use slightly different layouts.

### Example for R register
```text
REG,1,MyRegister,INT,123,$#$
```

### Example for PR
```text
PREG,1,MyPosition,$#$
```

### Example for SR
```text
SREG,1,MyString,Hello,$#$
```

### Example for UALM
```text
UALM,1,Alarm message,2,$#$
```

---

## 6. Routines Overview

### 6.1 `CLR_WND`
Clears the TP display, prompt, status, and function windows.

### 6.2 `CNV_INT2STR`
Converts an integer into a string without leading formatting characters.

### 6.3 `CNV_REAL2STR`
Converts a real number into a formatted string.

### 6.4 `GET_COMMENT`
Reads the comment associated with a given item type and index.

### 6.5 `GET_MAX`
Returns the maximum valid index for a given item type.

### 6.6 `output_cmt`
Exports controller comments and values into a CSV file.

### 6.7 `E_SPLIT`
Splits a string into tokens using a delimiter.

### 6.8 `read_line`
Reads a line from the CSV file.

### 6.9 `input_cmt`
Imports comments and values from a CSV file into controller memory.

---

## 7. Export Process

The export routine performs the following steps:

1. Determine the maximum valid number for each supported item type
2. Ask the user to select the target storage device
3. Create or overwrite `RobotComment.CSV`
4. Write all supported data and comments to the file
5. Close the file
6. Report success on the TP

---

## 8. Import Process

The import routine performs the following steps:

1. Ask the user to select the storage device containing `RobotComment.CSV`
2. Open the CSV file for reading
3. Read the file line by line
4. Split each line into fields
5. Validate record type and structure
6. Write comments and values back to the controller
7. Report errors if a line is invalid
8. Close the file

---

## 9. Error Handling

The program checks for:

- Invalid record type
- Invalid index
- Invalid CSV format
- File access errors
- Controller write errors

If an error is detected during import:

- `have_err` is set to `TRUE`
- The program posts an error message
- Import stops at the first invalid record

---

## 10. User Interface Flow

### Startup
The program displays an information page with:

- Program title
- Supported data types
- Author
- Version

### Main Menu
The user can select:

- `1` Export comments to CSV
- `2` Import comments from CSV
- `3` Exit

### Device Selection
For export and import, the user can choose:

- `MC:\`
- `UD1:\`
- `UT1:\`

---

## 11. Important Notes

### 11.1 CSV Terminator
The tool uses a fixed terminator string:

```text
$#$
```

This terminator is used to validate CSV record completeness.

### 11.2 Comment Limits
The program depends on controller limits for:

- Register count
- Position register count
- String register count
- Alarm count
- I/O count

### 11.3 Controller-Specific Behavior
Some functions in the program are controller-specific and depend on the FANUC TP environment.

---

## 12. Supported Applications

This tool is useful for:

- Backing up robot comments
- Restoring controller comments
- Migrating robot data between controllers
- Documentation and maintenance
- Offline comment management

---

## 13. Summary

`A_COMMENT` is a practical controller utility for exporting and importing comment data through CSV files.  
It supports a wide range of robot data types and is intended for maintenance, backup, and migration tasks.
