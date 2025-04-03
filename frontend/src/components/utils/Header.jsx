import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import Container from './Container';

export function Navbar() {
  const [isLoggedIn] = useState(true) // Replace with auth state

  return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <Container className={"w-full overflow-x-hidden"}>
      <div className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center font-bold">
          <span className="text-primary">Lost</span>&Found
        </Link>
        
        <nav className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>My Reports</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
      </Container>
    </header>

  )
}