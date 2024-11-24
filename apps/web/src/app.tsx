import { trpcClient } from '~/client';
import { Button } from '~/components/ui/button';

function App() {
  async function handleClick() {
    const res = await trpcClient.hello.query('Ghali');
    console.log(res);
  }

  return (
    <>
      Hello world!
      <Button onClick={() => handleClick()}>Click</Button>
    </>
  );
}

export default App;
