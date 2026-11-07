
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Kanban from './pages/Kanban'
import Statistics from './pages/Statistics'
import Calendar from './pages/Calendar'
import './App.css'

const emptyForm = {
  company: '',
  position: '',
  date: '',
  status: 'Başvuruldu',
  interviewDate: ''
}

function App() {
  // Sayfa yönetimi
  const [activePage, setActivePage] = useState('dashboard')

  // Arama ve filtreleme
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tümü')
  const [sortOrder, setSortOrder] = useState('newest')

  // Başvuruları LocalStorage'dan yükle
  
const [applications, setApplications] = useState(() => {
  try {
    const saved = localStorage.getItem(
      'careertrack-applications'
    )

    if (!saved) return []

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      console.error('Başvuru verisi geçerli bir liste değil.')
      return []
    }

    return parsed
  } catch (error) {
    console.error('Başvurular yüklenemedi:', error)
    return []
  }
})


  // Form yönetimi
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ ...emptyForm })

  // Başvurular değiştiğinde LocalStorage'a kaydet
  
useEffect(() => {
  try {
    localStorage.setItem(
      'careertrack-applications',
      JSON.stringify(applications)
    )
  } catch (error) {
    console.error('Başvurular kaydedilemedi:', error)
    alert(
      'Başvurular tarayıcıya kaydedilemedi. ' +
      'Sayfayı yenilemeden önce verilerini kontrol et.'
    )
  }
}, [applications])


  // Form alanlarını güncelle
  
function handleChange(event) {
  const { name, value } = event.target

  setFormData((previous) => ({
    ...previous,
    [name]: value,
    ...(name === 'status' && value !== 'Mülakat'
      ? { interviewDate: '' }
      : {})
  }))
}


  // Yeni başvuru ekle veya mevcut başvuruyu güncelle
 
function handleSubmit(event) {
  event.preventDefault()

  const cleanedData = {
    ...formData,
    company: formData.company.trim(),
    position: formData.position.trim(),
    interviewDate:
      formData.status === 'Mülakat'
        ? formData.interviewDate
        : ''
  }

  if (!cleanedData.company || !cleanedData.position) {
    alert('Şirket adı ve pozisyon boş bırakılamaz.')
    return
  }

  if (!cleanedData.date) {
    alert('Başvuru tarihi seçmelisin.')
    return
  }

  if (
    cleanedData.status === 'Mülakat' &&
    !cleanedData.interviewDate
  ) {
    alert('Mülakat tarihi seçmelisin.')
    return
  }

  if (editingId !== null) {
    setApplications((previous) =>
      previous.map((app) =>
        app.id === editingId
          ? { ...app, ...cleanedData }
          : app
      )
    )
  } else {
    const newApplication = {
      id: crypto.randomUUID(),
      ...cleanedData
    }

    setApplications((previous) => [
      ...previous,
      newApplication
    ])
  }

  resetForm()
}


  // Formu sıfırla
  function resetForm() {
    setFormData({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
  }

  // Başvuru düzenleme
  function handleEdit(app) {
    setEditingId(app.id)

   setFormData({
  company: app.company,
  position: app.position,
  date: app.date,
  status: app.status,
  interviewDate: app.interviewDate || ''
})

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Başvuru silme
  function handleDelete(id) {
    const confirmed = window.confirm(
      'Bu başvuruyu silmek istediğine emin misin?'
    )

    if (confirmed) {
      setApplications(
        applications.filter((app) => app.id !== id)
      )

      if (editingId === id) {
        resetForm()
      }
    }
  }

  // Dashboard istatistikleri
  const interviewCount = applications.filter(
    (app) => app.status === 'Mülakat'
  ).length

  const activeCount = applications.filter(
    (app) =>
      app.status === 'Başvuruldu' ||
      app.status === 'Mülakat'
  ).length

  // Arama, filtreleme ve sıralama
  const filteredApplications = applications
    .filter((app) => {
      const search = searchTerm.toLocaleLowerCase('tr-TR')

      const matchesSearch =
        app.company.toLocaleLowerCase('tr-TR').includes(search) ||
        app.position.toLocaleLowerCase('tr-TR').includes(search)

      const matchesStatus =
        statusFilter === 'Tümü' ||
        app.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.date.localeCompare(a.date)
      }

      return a.date.localeCompare(b.date)
    })

  return (
    <div className="app-layout">

      {/* Sol navigasyon menüsü */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Ana içerik alanı */}
      <main className="main-content">
  {activePage === 'dashboard' && (
    <Dashboard applications={applications} />
  )}

  {activePage === 'applications' && (
        <div className="dashboard">

          {/* Üst başlık */}
          <header className="header">
            <div>
              <h1>Başvurularım</h1>
              <p>İş başvurularını tek bir yerden yönet.</p>
            </div>

            <button
              className="add-button"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              + Yeni Başvuru Ekle
            </button>
          </header>

          {/* İstatistik kartları */}
          <section className="summary">

            <div className="summary-card">
              <h3>Toplam Başvuru</h3>
              <strong>{applications.length}</strong>
            </div>

            <div className="summary-card">
              <h3>Aktif Başvuru</h3>
              <strong>{activeCount}</strong>
            </div>

            <div className="summary-card">
              <h3>Mülakat</h3>
              <strong>{interviewCount}</strong>
            </div>

          </section>

          {/* Başvuru ekleme ve düzenleme formu */}
          {showForm && (
            <section className="form-section">

              <h2>
                {editingId !== null
                  ? 'Başvuruyu Düzenle'
                  : 'Yeni İş Başvurusu'}
              </h2>

              <form onSubmit={handleSubmit}>

                <input
                  type="text"
                  name="company"
                  placeholder="Şirket adı"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="position"
                  placeholder="Pozisyon"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Başvuruldu">Başvuruldu</option>
                  <option value="Mülakat">Mülakat</option>
                  <option value="Kabul">Kabul</option>
                  <option value="Red">Red</option>
                </select>

                
{formData.status === 'Mülakat' && (
  <div className="interview-date-field">
    <label htmlFor="interviewDate">
      Mülakat Tarihi
    </label>

    <input
      id="interviewDate"
      type="date"
      name="interviewDate"
      value={formData.interviewDate}
      onChange={handleChange}
      required
    />
  </div>
)}


                <button
                  type="submit"
                  className="save-button"
                >
                  {editingId !== null
                    ? 'Değişiklikleri Kaydet'
                    : 'Başvuruyu Kaydet'}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  İptal
                </button>

              </form>
            </section>
          )}

          {/* Başvurular bölümü */}
          <section className="applications">

            <h2>Başvurularım</h2>

            {/* Arama ve filtreleme */}
            <div className="filter-bar">

              <input
                type="text"
                placeholder="Şirket veya pozisyon ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Tümü">Tüm Durumlar</option>
                <option value="Başvuruldu">Başvuruldu</option>
                <option value="Mülakat">Mülakat</option>
                <option value="Kabul">Kabul</option>
                <option value="Red">Red</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
              </select>

            </div>

            {/* Başvuru listesi */}
            {filteredApplications.length === 0 ? (

              <div className="empty-state">
                <h3>
                  {applications.length === 0
                    ? 'Henüz başvuru eklenmedi'
                    : 'Aramanızla eşleşen başvuru bulunamadı'}
                </h3>

                <p>
                  {applications.length === 0
                    ? 'İlk iş başvurunu ekleyerek takibe başla.'
                    : 'Arama veya filtre seçeneklerini değiştirebilirsin.'}
                </p>
              </div>

            ) : (

              <div className="application-list">

                {filteredApplications.map((app) => (

                  <div
                    className="application-card"
                    key={app.id}
                  >

                    <div>
                      <h3>{app.company}</h3>
                      <p>{app.position}</p>
                    </div>

                    <div className="application-details">

                      <p>{app.date}</p>

                      <span className="status">
                        {app.status}
                      </span>

                      <div className="card-actions">

                        <button
                          className="edit-button"
                          onClick={() => handleEdit(app)}
                        >
                          Düzenle
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(app.id)}
                        >
                          Sil
                        </button>

                      </div>
                    </div>
                  </div>

                ))}

              </div>
            )}

              </section>
    </div>
  )}

  
{activePage === 'kanban' && (
  <Kanban
    applications={applications}
    setApplications={setApplications}
  />
)}


{activePage === 'statistics' && (
  <Statistics applications={applications} />
)}

{activePage === 'calendar' && (
  <Calendar applications={applications} />
)}

</main>

    </div>
  )
}

export default App
