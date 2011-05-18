from distutils.core import setup
setup( name='winRepo',
	version='0.2',
	url='not.yet',
	author='Irving Leonard',
	author_email='irvingleonard@ymail.com',
	packages=["winRepo"],
	package_dir={"winRepo":"bin"},
	data_files=[
				('c:\\repo', ['repo/repodata.xml']),
				('c:\\repo/7zip-920', ["repo/7zip-920/7zip-920.winpackage"]),
				('c:\\repo/AdbeRdr1001_es_ES', ["repo/AdbeRdr1001_es_ES/AdbeRdr1001_es_ES.winpackage"]),
				('c:\\repo/avg_free_x64_all_2011_1204a3402', ["repo/avg_free_x64_all_2011_1204a3402/avg_free_x64_all_2011_1204a3402.winpackage"]),
				('c:\\repo/office2010', ["repo/office2010/office2010.winpackage"]),
				],

	)