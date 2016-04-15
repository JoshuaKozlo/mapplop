from django import forms

ACTION_CHOICES = (
	('add', 'Add Venue'), 
	('remove', 'Remove Venue'), 
	('modify', 'Modify Venue'),
)

class ModifyVenuesForm(forms.Form):
	action = forms.ChoiceField(required=True, 
		widget=forms.RadioSelect, choices=ACTION_CHOICES)
	venue = forms.CharField(label='Venue Name', max_length=120, required=True, 
		widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Venue Name'}))
	city = forms.CharField(label='City', max_length=120, required=True,
		widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'City'}))
	state = forms.CharField(label='State', max_length=120, required=True,
		widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'State'}))
	comment = forms.CharField(label='Comments', max_length=500, required=False,
		widget=forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Comments'}))