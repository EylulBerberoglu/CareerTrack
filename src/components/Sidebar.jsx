
const menuItems = [
  { id: 'dashboard', icon: '▦', label: 'Dashboard' },
  { id: 'applications', icon: '▤', label: 'Başvurularım' },
  { id: 'kanban', icon: '☷', label: 'Kanban Panosu' },
  { id: 'statistics', icon: '◫', label: 'İstatistikler' },
  { id: 'calendar', icon: '▦', label: 'Takvim' }
]

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">C</div>
        <div>
          <h2>CareerTrack</h2>
          <span>Career Management</span>
        </div>
      </div>

      <div className="sidebar-section-title">
        MENÜ
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              activePage === item.id
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        CareerTrack v2.0
      </div>
    </aside>
  )
}

export default Sidebar
