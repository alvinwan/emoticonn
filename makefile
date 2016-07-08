# usage: make deploy m="commit message"
deploy:
	cd generator && \
		gulp sass && \
		gulp js && \
		gulp html && \
		cd ..
	git pull
	git add .
	git commit -m "$(m)"
	git push
	git checkout gh-pages && \
	  rm -rf images && \
		rm -rf fonts && \
	  cp -r published/*.html . && \
		cp -r published/js . && \
		cp -r published/emoticonn/css . && \
		mkdir fonts && \
		mkdir images && \
		cp -r published/fonts/* fonts && \
		cp -r published/images/* images
	git pull
	git add .
	git commit -m "$(m)"
	git push
	git checkout master
