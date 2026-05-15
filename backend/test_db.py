import asyncio
from app.database import user_collection
async def main():
    try:
        print(await user_collection.find_one({'email': 'test'}))
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(main())
