
import { useState } from 'react'

const weekDays = [
  'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'
]

const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan',
  'Mayıs', 'Haziran', 'Temmuz', 'Ağustos',
  'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

function Calendar({ applications }) {
  const [currentDate, setCurrentDate] = useState(
    new Date()
  )

  const [selectedDate, setSelectedDate] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Haftanın ilk günü pazartesi olsun
  const startOffset = (firstDay.getDay() + 6) % 7

  const today = new Date()
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  function formatDate(day) {
    return [
      year,
      String(month + 1).padStart(2, '0'),
      String(day).padStart(2, '0')
    ].join('-')
  }

  function changeMonth(amount) {
    setCurrentDate(new Date(year, month + amount, 1))
    setSelectedDate(null)
  }

  // Mülakat tarihi bulunan başvurular
  const interviews = applications.filter(
    (app) => app.interviewDate
  )

  // Takvim hücrelerini oluştur
  const calendarDays = [
    ...Array(startOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    )
  ]

  // Seçili günün mülakatları
  const selectedInterviews = interviews.filter(
    (app) => app.interviewDate === selectedDate
  )

  // Yaklaşan mülakatlar
  const upcomingInterviews = interviews
    .filter((app) => app.interviewDate >= todayString)
    .sort((a, b) =>
      a.interviewDate.localeCompare(b.interviewDate)
    )

  return (
    <div className="dashboard">

      <header className="header">
        <div>
          <h1>Mülakat Takvimi</h1>
          <p>
            İş görüşmelerini ve yaklaşan mülakatlarını takip et.
          </p>
        </div>
      </header>

      <div className="calendar-layout">

        <section className="calendar-card">

          <div className="calendar-header">
            <h2>{monthNames[month]} {year}</h2>

            <div className="calendar-navigation">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Önceki ay"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentDate(new Date())
                  setSelectedDate(null)
                }}
              >
                Bugün
              </button>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Sonraki ay"
              >
                ›
              </button>
            </div>
          </div>

          <div className="calendar-grid">

            {weekDays.map((day) => (
              <div
                className="calendar-weekday"
                key={day}
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    className="calendar-empty-cell"
                    key={`empty-${index}`}
                  />
                )
              }

              const dateString = formatDate(day)

              const dayInterviews = interviews.filter(
                (app) => app.interviewDate === dateString
              )

              const isToday = dateString === todayString
              const isSelected = dateString === selectedDate

              return (
                <button
                  type="button"
                  key={dateString}
                  className={`calendar-day ${
                    isToday ? 'today' : ''
                  } ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(dateString)}
                >
                  <span>{day}</span>

                  {dayInterviews.length > 0 && (
                    <div className="calendar-event">
                      {dayInterviews.length} mülakat
                    </div>
                  )}
                </button>
              )
            })}

          </div>
        </section>

        <aside className="calendar-sidebar">

          <section className="calendar-card">
            <h2>Seçilen Gün</h2>

            <p className="calendar-subtitle">
              {selectedDate || 'Takvimden bir gün seç'}
            </p>

            {selectedInterviews.length === 0 ? (
              <p className="calendar-no-events">
                Bu gün için mülakat bulunmuyor.
              </p>
            ) : (
              selectedInterviews.map((app) => (
                <div
                  className="calendar-interview"
                  key={app.id}
                >
                  <strong>{app.company}</strong>
                  <p>{app.position}</p>
                </div>
              ))
            )}
          </section>

          <section className="calendar-card">
            <h2>Yaklaşan Mülakatlar</h2>

            {upcomingInterviews.length === 0 ? (
              <p className="calendar-no-events">
                Yaklaşan mülakat bulunmuyor.
              </p>
            ) : (
              upcomingInterviews.map((app) => (
                <div
                  className="calendar-interview"
                  key={app.id}
                >
                  <strong>{app.company}</strong>
                  <p>{app.position}</p>
                  <small>{app.interviewDate}</small>
                </div>
              ))
            )}
          </section>

        </aside>

      </div>
    </div>
  )
}

export default Calendar
