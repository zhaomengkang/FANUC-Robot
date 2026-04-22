# CAL_TCP Program Documentation

## 1. Program Purpose

`CAL_TCP` is a robot calibration program used to:

- Calculate the **sphere center** from 4 measured poses
- Convert the sphere center into the **tool/flange coordinate frame**
- Estimate the **TCP offset**
- Evaluate the fitting quality if error analysis is added

This program is typically used for robot TCP calibration based on sphere-center fitting.

---

## 2. Input Data

The program uses four `XYZWPR` poses as test data:

- `pos1`
- `pos2`
- `pos3`
- `pos4`

Each pose contains:

| Field | Meaning |
|---|---|
| `X` | Cartesian X position |
| `Y` | Cartesian Y position |
| `Z` | Cartesian Z position |
| `W` | Orientation angle W |
| `P` | Orientation angle P |
| `R` | Orientation angle R |

---

## 3. Output Data

The program produces the following results:

| Variable | Meaning |
|---|---|
| `center` | Calculated sphere center |
| `tcp1` | TCP computed from `pos1` |
| `tcp2` | TCP computed from `pos2` |
| `tcp3` | TCP computed from `pos3` |
| `tcp4` | TCP computed from `pos4` |
| `tcp` | Final TCP result, averaged from the 4 poses |
| `sum_x` | Average TCP X offset |
| `sum_y` | Average TCP Y offset |
| `sum_z` | Average TCP Z offset |

---

## 4. Program Structure

The program contains two main routines:

### 4.1 `CALCSPH`
This routine calculates the sphere center from 4 measured points using:

- A linear system
- Gaussian elimination with partial pivoting
- Back substitution

### 4.2 `WRPR_TO_TCP`
This routine transforms the sphere center from the base frame into the local tool frame using:

- Pose orientation angles
- A homogeneous transformation matrix
- The inverse transformation

---

## 5. Sphere Center Calculation

The 4 measured points are assumed to lie on or near a common sphere:

\[
(x-c_x)^2 + (y-c_y)^2 + (z-c_z)^2 = r^2
\]

This is converted into a linear system:

\[
A \cdot X = B
\]

where:

- `A` is a 3×3 coefficient matrix
- `X` is the sphere center vector
- `B` is the right-hand-side vector

The system is solved using Gaussian elimination.

---

## 6. TCP Calculation

After the sphere center is computed, it is transformed into the local tool frame for each pose.

For one pose:

\[
TCP_i = T_i^{-1} \cdot center
\]

where:

- `T_i` is the homogeneous transformation matrix of the pose
- `T_i^{-1}` is the inverse transformation matrix

The final TCP result is the average of all 4 transformed values:

\[
TCP = \frac{TCP_1 + TCP_2 + TCP_3 + TCP_4}{4}
\]

---

## 7. Transformation Matrix

The pose transformation matrix is built from:

- `W`
- `P`
- `R`
- `X`
- `Y`
- `Z`

The matrix includes:

- A 3×3 rotation part
- A 3×1 translation part

The inverse transform is calculated using the transpose of the rotation matrix and the corresponding translation correction.

---

## 8. Calibration Result Interpretation

If the final TCP result is approximately:

\[
[0,\ 0,\ 180.2]
\]

then the tool TCP is offset by `180.2 mm` along the tool Z axis.

This usually indicates:

- No X or Y offset
- No orientation offset
- Only a Z-axis tool length

---

## 9. Important Notes

### 9.1 Angle Unit
Verify whether `W`, `P`, and `R` are in degrees or radians.  
The trigonometric functions must use the correct unit.

### 9.2 Rotation Order
The order of the rotations must match the robot controller convention.  
If the rotation order is wrong, the TCP result will also be wrong.

### 9.3 Numerical Stability
If the 4 points are nearly coplanar or poorly distributed, the sphere fit may become unstable.

### 9.4 Residual Error
If error evaluation is added, the residual for each point can be used to assess calibration quality.

---

## 10. Program Flow

1. Load the 4 test poses
2. Calculate the sphere center
3. Transform the sphere center into the local tool frame for each pose
4. Average the 4 TCP results
5. Store the final TCP in `tcp`

---

## 11. Application Areas

This program can be used for:

- Robot TCP calibration
- Probe calibration
- Tool center estimation
- Sphere center fitting
- Calibration verification

---

## 12. Example Result

Using the sample data, the expected TCP result should be close to:

```text
X = 0
Y = 0
Z = 180.2
```

This indicates a pure Z-axis tool offset.
