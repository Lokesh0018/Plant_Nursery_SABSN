import { useEffect, useState } from 'react';

// The nursery's posted hours: open daily, 7 am to 6 pm, India Standard Time (whatever the visitor's own zone).
export const OPENS = 7;
export const CLOSES = 18;

function read() {
  const [h, m] = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Kolkata' })
    .format(new Date()).split(':').map(Number);
  const mins = h * 60 + m;
  const now = mins >= OPENS * 60 && mins < CLOSES * 60;
  // where "now" falls on a 6 am to 8 pm line, in percent (null outside it), for hours bars
  const mark = mins >= 6 * 60 && mins <= 20 * 60 ? ((mins - 6 * 60) / (14 * 60)) * 100 : null;
  return { now, mark, label: now ? 'until 6 pm' : 'opens 7 am' };
}

/** Open or closed right now, re-checked every minute so a page left open stays right. */
export default function useOpenStatus() {
  const [status, setStatus] = useState(read);
  useEffect(() => {
    const id = setInterval(() => setStatus(read()), 60000);
    return () => clearInterval(id);
  }, []);
  return status;
}
