var tasks = new Array();
var deleteTaskTitle,deleteCard,editTaskTitle;
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
	$('.card-columns').on('focusin','#card-textarea',(event) => { 
		editTaskTitle = $(event.target).val(); 
	});
	$('.card-columns').on('focusout','#card-textarea', editTask);
	setTextarea();
});

/** Loads tasks from Local storage to Array */
function loadTask() {
	var temp = JSON.parse(localStorage.getItem("To_do"));
	for (var i in temp)
		tasks.push(temp[i]);
}
/** Add new task with title defined in textarea */
function addTask() {
	$("#empty-bg").css("display", "none");
	$(".card-columns").prepend(taskTemplate({ task_text: $('#new-task-text').val(), status: "Pending"}));
	tasks.push({ title: $("#new-task-text").val(), status: "Pending" });
	localStorage.setItem("To_do", JSON.stringify(tasks));
	setTextarea();
	$("#new-task-text").val("");
}
/** Edit given task when textarea lost focus   */
function editTask() {
	var newTitle = $(this).val();
	console.log(newTitle);
	changeTitle(editTaskTitle, newTitle);
	localStorage.setItem("To_do", JSON.stringify(tasks));
}
/** Delete task Permenantly from local storage */
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
/** Opens confirm Delete dialog*/
function openDeleteDialog(){
	deleteTaskTitle = $(this).parent().find("textarea").val();
	deleteCard = $(this).parent().parent();
	$('#confirmdialog').modal('show');
}
/** Change status of current task(from where this function is called) to Binned*/
function setBinned() {
	var card = $(this).parent().parent();
	var title = $(this).parent().find("textarea").val();
	changeStatus(title, "Binned");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
	$(".toast").toast("show");
}
/** Change status of current task(from where this function is called) to Complete*/
function setComplete() {
	var card = $(this).parent().parent();
	var title = $(this).parent().find("textarea").val();
	changeStatus(title, "Completed");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
}
/** Change status of current task(from where this function is called) to Pending*/
function setPending() {
	var card = $(this).parent().parent();
	var title = $(this).parent().find("textarea").val();
	changeStatus(title, "Pending");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
}
/** 
 * Loads tasks of specific status
 * @param {string} status - status of task
*/
function appendTask(status) {
	$("#empty-bg").css("display", "none");
	$(".card-columns").empty();
	var container = $(".card-columns");
	var task_list = tasks.filter(obj => {
		return obj.status === status;
	});
	if (task_list.length != 0) {
		for (var i = task_list.length - 1; i > -1; i--)
			container.append(taskTemplate({ task_text: task_list[i].title, status: status }));
		container.append('</div>');
	} else {
		emptyTaskList();
	}
	
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
	appendTask("Pending");
	setTextarea();
}
function showBinned() {
	$("#new-task-text").css("display", "none");
	$("#empty-bin").css("display", "unset");
	$("#title-pending").css("display", "none");
	$("#title-bin").css("display", "block");
	$("#title-complete").css("display", "none");
	appendTask("Binned");
	setTextarea();
}
function showCompleted() {
	$("#new-task-text").css("display", "none");
	$("#title-pending").css("display", "none");
	$("#empty-bin").css("display", "none");
	$("#title-bin").css("display", "none");
	$("#title-complete").css("display", "block");
	appendTask("Completed");
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
/**
 * Changes title of task
 * @param {string} old_title - The old title of the Task.
 * @param {string} new_title - The new title of the Task.
 */
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
/**
 * Creates Handlebar 
 * @param {string} containerId - Id of Html container template.
 */
function createHandlebar(containerId) {
	var template = document.getElementById(containerId).innerHTML;
	Handlebars.registerHelper('ifeq', (a, b, options) => {
		if (a == b) { return options.fn(this); }
		return options.inverse(this);
	});
	return Handlebars.compile(template);
}