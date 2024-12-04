import React from 'react';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const CustomAlert = ({ severity, message, ...props }
) => {
  return (
    <Alert  severity={severity} {...props}>
      {message}
    </Alert>
  );
};

CustomAlert.defaultProps = {
  severity: 'info', 
  message: 'This is a default alert message.',
};

CustomAlert.propTypes = {
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  message: PropTypes.string.isRequired,
};

export default CustomAlert;
