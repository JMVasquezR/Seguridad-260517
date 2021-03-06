# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-18 15:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdministradoresProyectoSistema',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('proyectosistema', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proyectos.ProyectoSistema')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proyectos.Usuario')),
            ],
            options={
                'db_table': 'ADMIN_PROYECTOSISTEMA',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='proyectosistema',
            name='usuarios',
            field=models.ManyToManyField(through='proyectos.AdministradoresProyectoSistema', to='proyectos.Usuario'),
        ),
    ]
