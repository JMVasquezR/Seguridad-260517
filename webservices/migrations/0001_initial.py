# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-08 16:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Parameter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=20)),
                ('descripcion', models.TextField()),
            ],
            options={
                'managed': True,
                'db_table': 'WEBSERVICE_PARAMETERS',
            },
        ),
        migrations.CreateModel(
            name='TipoVariable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=20)),
            ],
            options={
                'managed': True,
                'db_table': 'TIPOVARIABLES',
            },
        ),
        migrations.CreateModel(
            name='WebService',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('httpmethod', models.CharField(max_length=20)),
            ],
            options={
                'managed': True,
                'db_table': 'WEBSERVICES',
            },
        ),
        migrations.CreateModel(
            name='WebServiceParameters',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parameter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webservices.Parameter')),
                ('webservice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webservices.WebService')),
            ],
        ),
        migrations.AddField(
            model_name='webservice',
            name='parameters',
            field=models.ManyToManyField(through='webservices.WebServiceParameters', to='webservices.Parameter'),
        ),
        migrations.AddField(
            model_name='parameter',
            name='tipovariable',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webservices.TipoVariable'),
        ),
    ]