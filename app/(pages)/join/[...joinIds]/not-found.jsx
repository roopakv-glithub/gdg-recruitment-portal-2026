import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Department Not Found</h2>
      <p>Sorry, the department you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      <div>
        <Link href="/departments">Browse All Departments</Link>
        <br />
        <Link href="/">Go Home</Link>
      </div>
    </div>
  );
} 
