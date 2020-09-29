git clone https://github.com/sukhiboi/todo-react.git frontend;

cd frontend;

npm install;

npm test;

npm run build;

mv ./build ..;

cd ..;

git clone https://github.com/sukhiboi/todo-react-backend.git backend;

cd backend;

npm install;

npm test;

rm -rf node_modules

cp -R ./* ..;

cd ..;

rm -rf frontend backend;
