# Generated by Django 2.2.4 on 2019-08-25 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_comment_star'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='star',
            field=models.IntegerField(default=0),
        ),
    ]
