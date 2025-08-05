import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

class CalendarBookingSystem {
  constructor() {
    this.currentDate = new Date()
    this.selectedDate = null
    this.selectedTimeSlot = null
    this.maxBookingDays = 30
    this.closedDates = new Set()
    this.bookings = new Map() // 儲存預約資料 key: 'YYYY-MM-DD-HH:mm', value: true
    
    this.init()
  }

  init() {
    this.renderCalendar()
    this.bindEvents()
    this.loadSettings()
  }

  bindEvents() {
    // 月份導航
    document.getElementById('prevMonth').addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      this.renderCalendar()
    })

    document.getElementById('nextMonth').addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      this.renderCalendar()
    })

    // 時段選擇
    document.querySelectorAll('.time-slot-card').forEach(card => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('booked')) {
          this.selectTimeSlot(card)
        }
      })
    })

    // 預約按鈕
    document.getElementById('bookingBtn').addEventListener('click', () => {
      this.makeBooking()
    })

    // 管理設定
    document.getElementById('maxBookingDays').addEventListener('change', (e) => {
      this.maxBookingDays = parseInt(e.target.value)
      this.renderCalendar()
    })

    document.getElementById('addClosedDate').addEventListener('click', () => {
      this.addClosedDate()
    })
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()
    
    // 更新月份標題
    document.getElementById('currentMonth').textContent = 
      `${year}年 ${month + 1}月`

    // 計算日曆格子
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const calendarGrid = document.getElementById('calendar-grid')
    calendarGrid.innerHTML = ''

    // 生成6週的日曆
    for (let week = 0; week < 6; week++) {
      const weekRow = document.createElement('div')
      weekRow.className = 'row mb-1'

      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + (week * 7) + day)
        
        const dayCol = document.createElement('div')
        dayCol.className = 'col p-1'
        
        const dayButton = document.createElement('button')
        dayButton.className = 'btn w-100 day-btn'
        dayButton.textContent = currentDate.getDate()
        
        // 設定日期樣式
        if (currentDate.getMonth() !== month) {
          dayButton.classList.add('btn-light', 'text-muted')
          dayButton.disabled = true
        } else if (this.isDateAvailable(currentDate)) {
          dayButton.classList.add('btn-outline-primary')
          dayButton.addEventListener('click', () => {
            this.selectDate(currentDate)
          })
        } else {
          dayButton.classList.add('btn-light', 'text-muted')
          dayButton.disabled = true
        }

        // 標記選中的日期
        if (this.selectedDate && 
            currentDate.toDateString() === this.selectedDate.toDateString()) {
          dayButton.classList.remove('btn-outline-primary')
          dayButton.classList.add('btn-primary')
        }

        dayCol.appendChild(dayButton)
        weekRow.appendChild(dayCol)
      }

      calendarGrid.appendChild(weekRow)
    }
  }

  isDateAvailable(date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    // 檢查是否在可預約範圍內
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + this.maxBookingDays)
    
    // 檢查日期條件
    if (checkDate < today || checkDate > maxDate) {
      return false
    }
    
    // 檢查是否為關閉日期
    const dateString = this.formatDate(checkDate) // 使用 checkDate 確保格式化的是當前檢查的日期
    if (this.closedDates.has(dateString)) {
      return false
    }
    
    return true
  }

  selectDate(date) {
    this.selectedDate = new Date(date)
    this.selectedDate.setHours(0, 0, 0, 0) // 確保選中的日期是午夜，避免時區影響
    this.selectedTimeSlot = null
    this.renderCalendar()
    this.showTimeSlots()
    this.updateTimeSlotAvailability()
  }

  showTimeSlots() {
    document.getElementById("timeSlotSection").style.display = "block"
    
    // 清除時段選擇
    document.querySelectorAll(".time-slot-card").forEach(card => {
      card.classList.remove("selected")
    })
    
    document.getElementById("bookingBtn").disabled = true
  }

  updateTimeSlotAvailability() {
    const dateString = this.formatDate(this.selectedDate)
    
    document.querySelectorAll(".time-slot-card").forEach(card => {
      const time = card.dataset.time
      const bookingKey = `${dateString}-${time}`
      const availabilityDiv = card.querySelector(".availability")
      
      if (this.bookings.has(bookingKey)) {
        card.classList.add("booked")
        card.classList.remove("available")
        availabilityDiv.textContent = "已預約"
        availabilityDiv.className = "availability text-danger"
      } else {
        card.classList.add("available")
        card.classList.remove("booked")
        availabilityDiv.textContent = "可預約"
        availabilityDiv.className = "availability text-success"
      }
    })
  }

  selectTimeSlot(card) {
    // 清除其他選擇
    document.querySelectorAll(".time-slot-card").forEach(c => {
      c.classList.remove("selected")
    })
    
    // 選中當前時段
    card.classList.add("selected")
    this.selectedTimeSlot = card.dataset.time
    
    // 啟用預約按鈕
    document.getElementById("bookingBtn").disabled = false
  }

  makeBooking() {
    if (!this.selectedDate || !this.selectedTimeSlot) {
      alert("請選擇日期和時段")
      return
    }
    
    const dateString = this.formatDate(this.selectedDate)
    const bookingKey = `${dateString}-${this.selectedTimeSlot}`
    
    if (this.bookings.has(bookingKey)) {
      alert("此時段已被預約")
      return
    }
    
    // 確認預約
    const confirmMessage = `確認預約 ${dateString} ${this.selectedTimeSlot} 嗎？`
    if (confirm(confirmMessage)) {
      this.bookings.set(bookingKey, true)
      this.updateTimeSlotAvailability()
      alert("預約成功！")
      
      // 清除選擇
      this.selectedTimeSlot = null
      document.querySelectorAll(".time-slot-card").forEach(card => {
        card.classList.remove("selected")
      })
      document.getElementById("bookingBtn").disabled = true
    }
  }

  addClosedDate() {
    const dateInput = document.getElementById("closedDate")
    const date = dateInput.value
    
    if (!date) {
      alert("請選擇要關閉的日期")
      return
    }
    
    // 確保日期是基於本地時間的午夜，避免時區偏移
    const closedDate = new Date(date)
    closedDate.setHours(0, 0, 0, 0)
    this.closedDates.add(this.formatDate(closedDate))
    this.renderClosedDatesList()
    this.renderCalendar()
    dateInput.value = ""
  }

  renderClosedDatesList() {
    const container = document.getElementById("closedDatesList")
    container.innerHTML = ""
    
    this.closedDates.forEach(dateString => {
      const badge = document.createElement("span")
      badge.className = "badge bg-danger"
      badge.innerHTML = `${dateString} <button type="button" class="btn-close btn-close-white ms-1" style="font-size: 0.7em;"></button>`
      
      badge.querySelector(".btn-close").addEventListener("click", () => {
        this.closedDates.delete(dateString)
        this.renderClosedDatesList()
        this.renderCalendar()
      })
      
      container.appendChild(badge)
    })
  }

  formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  loadSettings() {
    // 這裡可以從 localStorage 或 API 載入設定
    this.renderClosedDatesList()
  }
}

// 初始化系統
document.addEventListener("DOMContentLoaded", () => {
  window.calendarSystem = new CalendarBookingSystem()
})
