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
	  cp -r published/ . && \
		cp -r published/images . && \
		cp -r published/fonts .
	git pull
	git add .
	git commit -m "$(m)"
	git push
