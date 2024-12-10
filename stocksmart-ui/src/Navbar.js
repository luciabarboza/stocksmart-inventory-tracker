import './Navbar.css';

function Navbar({ user, onSignOut }) {
  return (
    <div className="Navbar">
      <ul>
        <li>
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="/createshoppinglist">Create Shopping List</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
        {user ? (
          <li>
            <button onClick={onSignOut} className="Navbar">
              Sign Out
            </button>
          </li>
        ) : (
          <li>
            <a href="/login">Login</a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
