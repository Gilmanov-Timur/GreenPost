import IMask from 'imask'

export default {
	bind: function(input, {value}) {
		//console.log(input)
		//console.log(value)
		//var re = new RegExp('^\\S*$');
		//'/^\\S*$/'
		IMask(input, {
			//mask: /^\S*$/
			//regex: "/^\S*$/"
			//mask: value.regex
			mask: new RegExp('^' + value.regex + '$')
			//mask: /^\d+$/
		});
		//console.log(digitsMask)
		//Inputmask(value).mask(input)

		input.addEventListener('paste', function() {
			input.dispatchEvent(new CustomEvent('input'));
		});
		input.addEventListener('change', function() {
			input.dispatchEvent(new CustomEvent('input'));
		});


	},
	unbind: function(input) {
		console.log(input)
		//if (input.inputmask) {
		//	input.inputmask.remove()
		//}
	}
}
