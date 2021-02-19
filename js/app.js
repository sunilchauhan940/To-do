var tasks = new Array();
var deleteTaskTitle,deleteCard;
var taskTemplate = createHandlebar("task-card");

$(document).ready(function () {
	loadTask();
	showPending();
	$('#pending').on('click', showPending);
	$('#completed').on('click', showCompleted);
	$('#bin').on('click', showBinned);
	$('#new-task-text').on('change', addTask);
	$('.card-columns').on('click','#del-btn',setBinned);
	$('.card-columns').on('click','#done-btn',setComplete);
	$('.card-columns').on('click','#pending-btn',setPending);
	$('.card-columns').on('click','#final-del-btn',openDeleteDialog);
	$('#confirmdialog').on('click', '#confirm-del-btn', deleteTask);
	$('#empty-bin').on('click', emptyBin);
	$('textarea').on('focusin',() => { $(this).data('val', $(this).val()); });
	$('textarea').on('change', editTask);
	setTextarea();
});

function loadTask() {
	var temp = JSON.parse(localStorage.getItem("To_do"));
	for (var i in temp)
		tasks.push(temp[i]);
}
function addTask() {
	$("#empty-bg").css("display", "none");
	$(".card-columns").prepend(taskTemplate({ task_text: $("#new-task-text").val(), status: "Pending" }));
	tasks.push({ title: $("#new-task-text").val(), status: "Pending" });
	localStorage.setItem("To_do", JSON.stringify(tasks));
	setTextarea();
	$("#new-task-text").val("");
}
function editTask() {
	console.log("sds");
	var newTitle = $(this).val();
	var oldTitle = $(this).data('val');
	changeTitle(oldTitle, newTitle);
	localStorage.setItem("To_do", JSON.stringify(tasks));
}
function deleteTask() {
	console.log(deleteTaskTitle);
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].title == deleteTaskTitle)
			tasks = tasks.filter(obj => {
				return obj != tasks[i];
			});
	}
	localStorage.setItem("To_do", JSON.stringify(tasks));
	deleteCard.fadeOut(500, cardRemove);
	$('#confirmdialog').modal('hide');
}
function openDeleteDialog(){
	deleteTaskTitle = $(this).parent().find("textarea").val();
	deleteCard = $(this).parent().parent();
	$('#confirmdialog').modal('show');
}
function setBinned() {
	console.log($(this));
	var card = $(this).parent().parent();
	var title = $(this).parent().find("textarea").val();
	changeStatus(title, "Binned");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
	$(".toast").toast("show");
}
function setComplete() {
	var card = $(this).parent().parent();
	var title = $(this).parent().find("textarea").val();
	changeStatus(title, "Completed");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
}
function setPending() {
	var card = $(this).parent().parent();
	var title = $(this).parent().find("textarea").val();
	changeStatus(title, "Pending");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
}
function appendTask(task_list, status) {
	$("#empty-bg").css("display", "none");
	$(".card-columns").empty();
	var container = $(".card-columns");
	for (var i = task_list.length - 1; i > -1; i--)
		container.append(taskTemplate({ task_text: task_list[i].title, status: status }));
	container.append('</div>');
}
function emptyTaskList() {
	$("#empty-bg").css("display", "unset");
	$(".card-columns").empty();
}
function showPending() {
	$("#new-task-text").css("display", "block");
	$("#title-pending").css("display", "block");
	$("#empty-bin").css("display", "none");
	$("#title-bin").css("display", "none");
	$("#title-complete").css("display", "none");
	var pendingTasks = tasks.filter(obj => {
		return obj.status === "Pending";
	});
	if (pendingTasks.length != 0) {
		appendTask(pendingTasks, "Pending");
	} else {
		emptyTaskList();
	}
	setTextarea();
}
function showBinned() {
	$("#new-task-text").css("display", "none");
	$("#empty-bin").css("display", "unset");
	$("#title-pending").css("display", "none");
	$("#title-bin").css("display", "block");
	$("#title-complete").css("display", "none");
	var binnedTasks = tasks.filter(obj => {
		return obj.status === "Binned";
	});
	if (binnedTasks.length != 0) {
		appendTask(binnedTasks, "Binned");
	} else {
		emptyTaskList();
	}
	setTextarea();
}
function showCompleted() {
	$("#new-task-text").css("display", "none");
	$("#title-pending").css("display", "none");
	$("#empty-bin").css("display", "none");
	$("#title-bin").css("display", "none");
	$("#title-complete").css("display", "block");
	var completedTasks = tasks.filter(obj => {
		return obj.status === "Completed";
	});
	if (completedTasks.length != 0) {
		appendTask(completedTasks, "Completed");
	} else {
		emptyTaskList();
	}
	setTextarea();
}
function setTextarea() {
	$('textarea').each(function () {
		this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
	}).on('input', function () {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});
}
function cardRemove() {
	var parent = $(this).parent();
	this.remove();
	if (!parent.children().length > 0) {
		$("#empty-bg").css("display", "block");
	}
}
function changeStatus(task_title, task_status) {
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].title == task_title) {
			tasks[i].status = task_status;
			break;
		}
	}
}
function changeTitle(old_title, new_title) {
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].title == old_title) {
			tasks[i].title = new_title;
			break;
		}
	}
}
function emptyBin() {
	tasks = tasks.filter(obj => {
		return obj.status !== "Binned";
	});
	localStorage.setItem("To_do", JSON.stringify(tasks));
	showBinned();
}
function createHandlebar(containerId) {
	var template = document.getElementById(containerId).innerHTML;
	Handlebars.registerHelper('ifeq', (a, b, options) => {
		if (a == b) { return options.fn(this); }
		return options.inverse(this);
	});
	return Handlebars.compile(template);
}