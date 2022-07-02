import './IconButton.scss'

function IconButton({ icon, type, className, ...rest }) {
  return <button className={`icon-button icon-button--${type} ${className ?? ''}`} data-icon={icon} {...rest}></button>
}

export default IconButton
