if [ -f .env ]; then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi
deno run --allow-env --allow-net functions/chessmaster-endpoint/index.ts