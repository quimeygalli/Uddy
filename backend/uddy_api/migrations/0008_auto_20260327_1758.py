from django.db import migrations

def add_colors(apps, schema_editor):
    SubjectCategory = apps.get_model('uddy_api', 'SubjectCategory')

    colors = {
        'Accounting': 'bg-red-200',
        'Biology': 'bg-green-200',
        'Computer Science': 'bg-blue-200',
        'Engineering': 'bg-orange-200',
        'History': 'bg-yellow-200',
        'Humanities': 'bg-purple-200',
        'Literature': 'bg-pink-200',
        'Marketing': 'bg-cyan-200',
        'Math': 'bg-indigo-200',
        'Psychology': 'bg-lime-200',
        'Science': 'bg-slate-200',
    }

    for name, color in colors.items():
        SubjectCategory.objects.filter(name=name).update(color=color)

class Migration(migrations.Migration):

    dependencies = [
        ('uddy_api', '0007_alter_subjectcategory_color'),
    ]

    operations = [
        # All afternoon for this crap
        migrations.RunPython(add_colors),
    ]