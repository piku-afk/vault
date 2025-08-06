import { Button, Container } from '@mantine/core';
import { createClient } from 'app/utils/supabase.server';
import { NavLink, redirect } from 'react-router';

import type { Route } from './+types/_index';

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);

  const { data } = await supabase.auth.getUser();

  if (data.user) {
    return redirect('/investments');
  }
}

export default function Home() {
  return (
    <Container>
      <Button component={NavLink} to='/login'>
        Login
      </Button>
    </Container>
  );
}
