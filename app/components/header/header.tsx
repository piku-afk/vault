import { ActionIcon, Box, Button, Container, Divider, Group, Image, Title } from '@mantine/core';
import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function Header() {
  const { pathname } = useLocation();
  const isInvestmentPage = pathname === '/investments';

  return (
    <Box component='header'>
      <Container py='lg'>
        <Group gap='xs'>
          <Image src='/vault.svg' alt='Vault Icon' w='auto' h={32} />
          <Title order={1} size='h5' fw='normal'>
            Vault by pikuh
          </Title>

          {isInvestmentPage && (
            <Box ml='auto'>
              <Button
                component={Link}
                to='/logout'
                size='xs'
                display={{ base: 'none', xs: 'block' }}
                leftSection={<LogOut size={16} />}
                variant='default'>
                Logout
              </Button>

              <ActionIcon
                component={Link}
                to='/logout'
                variant='default'
                display={{ base: 'block', xs: 'none' }}
                size='lg'>
                <LogOut size={16} />
              </ActionIcon>
            </Box>
          )}
        </Group>
      </Container>

      <Divider />
    </Box>
  );
}
