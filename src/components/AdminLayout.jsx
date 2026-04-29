import { Button } from './Button.jsx';

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: 'TB' },
  { id: 'notes', label: 'Notes', icon: 'NO' },
  { id: 'users', label: 'Utilisateurs', icon: 'US' },
  { id: 'settings', label: 'Parametres', icon: 'PA' },
];

export function AdminLayout({ activePage, title, userName, userEmail, onNavigate, onSignOut, children }) {
  const initials = getInitials(userName || userEmail);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Navigation principale">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            F
          </div>
          <div>
            <strong>Formation IA</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Workspace</span>
          <strong>Staging</strong>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow">{title}</p>
            <h1>{activePage === 'dashboard' ? `Bonjour, ${userName}` : title}</h1>
          </div>

          <div className="user-menu">
            <div className="avatar" aria-hidden="true">
              {initials}
            </div>
            <div className="user-meta">
              <strong>{userName}</strong>
              <span>{userEmail}</span>
            </div>
            <Button variant="secondary" onClick={onSignOut}>
              Logout
            </Button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

function getInitials(value = '') {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
