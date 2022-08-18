import "./header.styles.scss";

const Header = () => (
  <div className="nav">
    <input type="checkbox" />
    <span />
    <span />
    <div className="menu">
      <li>
        <a href="#">home</a>
      </li>
      <li>
        <a href="#">about</a>
      </li>
      <li>
        <a href="#">cursos</a>
      </li>
      <li>
        <a href="#">blog</a>
      </li>
      <li>
        <a href="#">contactos</a>
      </li>
    </div>
  </div>
);

export default Header;
