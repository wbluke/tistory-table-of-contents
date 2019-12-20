for f in dev-toc.*
do
  filename=$(basename -- "$f")
  extension="${filename##*.}"
  cp $f ../toc.${extension}
  echo "$f is copied"
done
