import './styles.css';

export const Button = ({ children, ...props }) =>
  <button className="button" {...props}>{children}</button>;
