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
	  cp -r published/ . && \
		rm images && \
		rm fonts && \
		cp -r published/fonts . && \
		cp -r published/images .
	git pull
	git add .
	git commit -m "$(m)"
	git push
	git checkout master
