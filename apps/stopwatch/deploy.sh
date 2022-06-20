yarn build
cd ../../
ls > lista.txt
echo "$(tail -n +2 lista.txt)" > lista.txt
xargs rm -v < lista.txt
rm -rf static
rm -rf lista.txt
cd ./apps/stopwatch/build
mv ./* ../../../
git add --all
git commit -m deploy
git push