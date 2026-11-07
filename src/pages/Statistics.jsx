
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = {
  Başvuruldu: '#6366f1',
  Mülakat: '#f59e0b',
  Kabul: '#16a34a',
  Red: '#ef4444'
}

const statuses = [
  'Başvuruldu',
  'Mülakat',
  'Kabul',
  'Red'
]

function Statistics({ applications }) {
  const total = applications.length

  // Başvuruları durumlarına göre say
  const statusData = statuses.map((status) => ({
    name: status,
    value: applications.filter(
      (app) => app.status === status
    ).length
  }))

  const interviewCount = statusData.find(
    (item) => item.name === 'Mülakat'
  ).value

  const acceptedCount = statusData.find(
    (item) => item.name === 'Kabul'
  ).value

  const rejectedCount = statusData.find(
    (item) => item.name === 'Red'
  ).value

  // Mülakat aşamasına ulaşmış başvuruların
  // yaklaşık oranı (mevcut duruma göre)
  const interviewRate = total > 0
    ? Math.round(
        ((interviewCount + acceptedCount) / total) * 100
      )
    : 0

  // Aylık başvuru sayılarını hesapla
  const monthlyCounts = {}

  applications.forEach((app) => {
    if (!app.date) return

    const month = app.date.slice(0, 7)

    monthlyCounts[month] =
      (monthlyCounts[month] || 0) + 1
  })

  const monthlyData = Object.entries(monthlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month,
      count
    }))

  return (
    <div className="dashboard">

      <header className="header">
        <div>
          <h1>İstatistikler</h1>
          <p>
            İş başvurularının performansını analiz et.
          </p>
        </div>
      </header>

      {/* Özet kartları */}
      <section className="stats-summary">

        <div className="summary-card">
          <h3>Toplam Başvuru</h3>
          <strong>{total}</strong>
        </div>

        <div className="summary-card">
          <h3>Mülakat / Kabul Oranı</h3>
          <strong>%{interviewRate}</strong>
        </div>

        <div className="summary-card">
          <h3>Kabul Edilen</h3>
          <strong>{acceptedCount}</strong>
        </div>

        <div className="summary-card">
          <h3>Reddedilen</h3>
          <strong>{rejectedCount}</strong>
        </div>

      </section>

      {/* Grafikler */}
      <div className="charts-grid">

        <section className="chart-card">
          <h2>Başvuru Durum Dağılımı</h2>
          <p>Başvuruların mevcut durumları</p>

          {total === 0 ? (
            <div className="chart-empty">
              Grafik için başvuru eklemelisin.
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={3}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="chart-card">
          <h2>Aylık Başvuru Sayıları</h2>
          <p>Başvuru tarihlerine göre dağılım</p>

          {monthlyData.length === 0 ? (
            <div className="chart-empty">
              Henüz aylık veri bulunmuyor.
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Başvuru"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

      </div>

      {/* Durum özeti */}
      <section className="chart-card stats-details">
        <h2>Başvuru Durumları</h2>

        <div className="status-stats">
          {statusData.map((item) => (
            <div className="status-stat-row" key={item.name}>
              <div className="status-stat-label">
                <span
                  className="status-dot"
                  style={{
                    backgroundColor: COLORS[item.name]
                  }}
                />
                {item.name}
              </div>

              <div className="status-stat-progress">
                <div
                  style={{
                    width: total > 0
                      ? `${(item.value / total) * 100}%`
                      : '0%',
                    backgroundColor: COLORS[item.name]
                  }}
                />
              </div>

              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Statistics
