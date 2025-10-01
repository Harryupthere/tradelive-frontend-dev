// import React from 'react';
// import { Controller, Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
// import {
//   TextField,
//   FormControl,
//   FormLabel,
//   FormHelperText,
//   InputAdornment,
//   SxProps,
//   Theme,
// } from '@mui/material';

// interface TextInputProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label?: string;
//   rules?: RegisterOptions;
//   placeholder?: string;
//   maxLength?: number;
//   readOnly?: boolean;
//   suffix?: string | React.ReactNode;
//   disabled?: boolean;
//   type?: string;
//   variant?: 'outlined' | 'filled' | 'standard';
//   fullWidth?: boolean;
//   size?: 'small' | 'medium';
//   sx?: SxProps<Theme>;
// }

// export const TextInput = <T extends FieldValues>({
//   control,
//   name,
//   label,
//   rules,
//   placeholder,
//   maxLength,
//   readOnly,
//   suffix,
//   disabled,
//   type = 'text',
//   variant = 'outlined',
//   fullWidth = true,
//   size = 'medium',
//   sx,
// }: TextInputProps<T>): React.ReactElement => (
//   <Controller
//     name={name}
//     control={control}
//     rules={rules}
//     render={({ field, fieldState: { error } }) => (
//       <FormControl 
//         fullWidth={fullWidth} 
//         error={!!error}
//         variant={variant}
//         sx={sx}
//       >
//         {label && (
//           <FormLabel 
//             component="legend" 
//             required={!!rules?.required}
//             sx={{ 
//               mb: 1,
//               fontWeight: 'medium',
//               color: 'text.primary',
//               '&.Mui-required::after': {
//                 content: '" *"',
//                 color: 'error.main',
//               }
//             }}
//           >
//             {label}
//           </FormLabel>
//         )}
        
//         <TextField
//           {...field}
//           type={type}
//           placeholder={placeholder}
//           inputProps={{
//             maxLength: maxLength,
//             readOnly: readOnly,
//           }}
//           disabled={disabled || readOnly}
//           error={!!error}
//           helperText={error?.message}
//           variant={variant}
//           size={size}
//           fullWidth={fullWidth}
//           InputProps={{
//             endAdornment: suffix ? (
//               <InputAdornment position="end">
//                 {suffix}
//               </InputAdornment>
//             ) : null,
//           }}
//           sx={{
//             '& .MuiInputBase-input.Mui-readOnly': {
//               backgroundColor: 'action.hover',
//               cursor: 'not-allowed',
//             },
//           }}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//             if (maxLength && e.target.value.length > maxLength) {
//               return;
//             }
//             field.onChange(e);
//           }}
//         />
        
//         {!error && maxLength && (
//           <FormHelperText sx={{ textAlign: 'right', mx: 0 }}>
//             {(field.value as string)?.length || 0}/{maxLength}
//           </FormHelperText>
//         )}
//       </FormControl>
//     )}
//   />
// );