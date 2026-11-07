
function Dashboard({ applications }) {
  const total = applications.length

  const active = applications.filter(
    (app) =>
      app.status === 'Başvuruldu' ||
      app.status === 'Mülakat'
  ).length

  const interviews = applications.filter(
    (app) => app.status === 'Mülakat'
  ).length

  const accepted = applications.filter(
    (app) => app.status === 'Kabul'
  ).length

  const recentApplications = [...applications]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Dashboard</h1>
          <p>Kariyer yolculuğuna genel bakış.</p>
        </div>
      </header>

      <section className="summary">
        <div className="summary-card">
          <h3>Toplam Başvuru</h3>
          <strong>{total}</strong>
        </div>

        <div className="summary-card">
          <h3>Aktif Başvuru</h3>
          <strong>{active}</strong>
        </div>

        <div className="summary-card">
          <h3>Mülakat</h3>
          <strong>{interviews}</strong>
        </div>

        <div className="summary-card">
          <h3>Kabul</h3>
          <strong>{accepted}</strong>
        </div>
      </section>

      <section className="applications">
        <h2>Son Başvurular</h2>

        {recentApplications.length === 0 ? (
          <div className="empty-state">
            <h3>Henüz başvuru bulunmuyor</h3>
            <p>Başvurularım sayfasından ilk kaydını oluştur.</p>
          </div>
        ) : (
          <div className="application-list">
            {recentApplications.map((app) => (
              <div className="application-card" key={app.id}>
                <div>
                  <h3>{app.company}</h3>
                  <p>{app.position}</p>
                </div>

                <div className="application-details">
                  <p>{app.date}</p>
                  <span className="status">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
