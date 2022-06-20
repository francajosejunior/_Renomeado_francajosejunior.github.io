yarn build
cd ../../
rm !(apps)
cd ./apps/stopwatch/build
mv ./* ../../../
git add .
git commit -m deploy
git push