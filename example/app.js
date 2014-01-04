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
			return Gavia.Deferred.when.apply(null, results.map(function (result) {
				return calllback(result);
			}));
		});
	};

	$(function () {
		$('#menu').on('click', 'a:nth-child(2)', function () {
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
		}).on('click', 'a:nth-child(3)', function () {
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
					var state = result.complete ? '済' : '未';
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
			$('#menu').children('a:not(:first-child)').addClass('disabled');
		}).on('click', 'input[type=checkbox]', function () {
			var anyChecked = $(this).parents('#main').find('.todo input[type=checkbox]').map(function () {
				return this.checked;
			}).toArray().some(function (x) {
				return x;
			});
			if (anyChecked)
				$('#menu').children('a:not(:first-child)').removeClass('disabled');
			else
				$('#menu').children('a:not(:first-child)').addClass('disabled');
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

		$('#create').on('show.bs.modal', function () {
			var body = $(this).find('.modal-body');
			body.find('[name=title]').val('');
			body.find('[name=memo]').val('');
			body.find('.alert').addClass('hide').hide();
			body.find('.form-group:eq(0)').removeClass('has-error');
		}).on('click', '.modal-footer .btn-primary', function () {
			var $$ = $(this).parent().prev(),
				name = $$.find('[name=title]').val(),
				memo = $$.find('[name=memo]').val();
			if (name === '') {
				$$.find('.alert').removeClass('hide').show();
				$$.find('.form-group:eq(0)').addClass('has-error');
				return;
			}
			$$.parents('#create').modal('hide')

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