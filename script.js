// 1. تحديد العناصر من HTML
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statsText = document.getElementById('statsText');
const progressCircle = document.getElementById('progressText');
const filterBtns = document.querySelectorAll('.filter-btn');

// 2. جلب المهام المحفوظة مسبقاً أو إنشاء قائمة فارغة
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentFilter = 'all';

// 3. حفظ البيانات فـ localStorage
function saveToLocalStorage() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// 4. تحديث الدائرة والنسبة المئوية للإنجاز
function updateProgress() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  
  statsText.textContent = `${completedTasks} of ${totalTasks} completed`;
  
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  progressCircle.innerHTML = `<span>${percentage}%</span>`;
  progressCircle.style.setProperty('--percent', percentage);
}

// 5. طباعة المهام فالواجهة (Render)
function renderTasks() {
  taskList.innerHTML = '';

  // تصفية المهام حسب الفلتر المختار
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // all
  });

  filteredTasks.forEach((task) => {
    // معرفة الـ index الأصلي للمهمة
    const originalIndex = tasks.indexOf(task);

    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add('completed');
    }

    // التبديل بين مكتملة وغير مكتملة عند الضغط
    span.addEventListener('click', function() {
      tasks[originalIndex].completed = !tasks[originalIndex].completed;
      saveToLocalStorage();
      renderTasks();
    });

    // زر المسح
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('delete-btn');
    
    deleteBtn.addEventListener('click', function() {
      tasks.splice(originalIndex, 1);
      saveToLocalStorage();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateProgress();
}

// 6. إضافة مهمة جديدة
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  tasks.push({
    text: taskText,
    completed: false
  });

  saveToLocalStorage();
  renderTasks();
  taskInput.value = "";
}

// 7. الأحداث (Event Listeners)
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// تشغيل التطبيق لأول مرة عند فتح الصفحة
renderTasks();