(function ($, undefined) {
	'use strcit';

	var todo = Gavia('todo', {
		todo: {
			keyPath: 'id',
			autoIncrement: true,
			index: {
				unique: true
			}
		}
	}).todo;

	var applyTodo = function (ids, calllback) {
		return todo.filter(function (result) {
			return ids.some(function (id) {
				return result.id === id;
			});
		}).then(function (results) {
			return $.when.apply(null, results.map(function (result) {
				return calllback(result);
			}));
		});
	};

	$(function () {
		$('#menu').on('click', 'button:first-child', function () {
			$('#createTodo').modal();
		}).on('click', 'button:nth-child(2)', function () {
			var ids = $('.todo input[type=checkbox]').filter(function () {
					return this.checked;
				}).map(function () {
					return $(this).parents('.todo').data('id');
				}).toArray();
			applyTodo(ids, function (todo) {
				return todo.update({
					complete: true
				}).save().promise;
			}).done(function () {
				$('#main').trigger('update');
				$('.alert:nth-child(3)').show();
			}).fail(function () {
				$('.alert:nth-child(4)').show();
			});
		}).on('click', 'button:nth-child(3)', function () {
			var ids = $('.todo input[type=checkbox]').filter(function () {
				return this.checked;
			}).map(function () {
				return $(this).parents('.todo').data('id');
			}).toArray();
			applyTodo(ids, function (todo) {
				return todo.delete();
			}).done(function () {
				$('#main').trigger('update');
				$('.alert:nth-child(5)').show();
			}).fail(function () {
				$('.alert:nth-child(6)').show();
			});
		});

		$('#main').on('update', function () {
			var ids = [].slice.call(arguments, 1);
			(function () {
				if (ids.length === 0) {
					$('#main tbody').empty();
					return todo.all();
				}
				return todo.filter(function (result) {
					return ids.some(function (id) {
						return result.id === id;
					});
				});
			})().done(function (results) {
				results.forEach(function (result) {
					var state = result.complete ? 'success' : 'error';
					$('#todo-template').tmpl({
						name: result.name,
						memo: result.memo,
						state: state
					}).attr('data-id', result.id)
						.addClass(state)
						.appendTo('#main tbody');
				});
			}).fail(function () {
				$('.alert:nth-child(7)').show();
			});
		}).on('click', 'input[type=checkbox]', function () {
			var anyChecked = $(this).parents('#main').find('.todo input[type=checkbox]').map(function () {
				return this.checked;
			}).toArray().some(function (x) {
				return x;
			});
			if (anyChecked)
				$('#menu').children('button:not(:first-child)').removeClass('disabled');
			else
				$('#menu').children('button:not(:first-child)').addClass('disabled');
		}).on('click', 'i.icon-remove-sign', function () {
			var id = $(this).parents('.todo').data('id');
			applyTodo([id], function (todo) {
				return todo.delete();
			}).done(function () {
				$('#main').trigger('update');
				$('.alert:nth-child(5)').show();
			}).fail(function () {
				$('.alert:nth-child(6)').show();
			});
		});

		$('#createTodo').on('show', function () {
			var body = $(this).find('.modal-body');
			body.children('[name=title]').val('');
			body.children('[name=memo]').val('');
			body.children('.alert').hide();
		}).on('click', '.modal-footer .btn-primary', function () {
			var $$ = $(this).parent().prev(),
				name = $$.children('[name=title]').val(),
				memo = $$.children('[name=memo]').val();
			$$.children('.alert').hide();
			if (name === '') {
				$$.children('.alert').show();
				return;
			}
			$$.parent().modal('toggle');

			todo.create().update({
				name: name,
				date: Date(),
				memo: memo,
				complete: false
			}).save().promise.done(function (id) {
				$('#main').trigger('update', id);
				$('.alert:nth-child(1)').show();
			}).fail(function () {
				$('.alert:nth-child(2)').show();
			});
		});

		$('#main').trigger('update');
	});
}).call(this, jQuery);