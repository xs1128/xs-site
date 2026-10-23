'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Lock, RefreshCw } from 'lucide-react';
import {
  isResponding,
  parseHomelabSnapshot,
  type HomelabSnapshot,
} from '@/lib/homelab-status';
import styles from './homelab-status.module.css';
import sceneStyles from './projects.module.css';

function ServiceLogo({ logo, icon }: { logo?: string; icon: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={styles.logo} aria-hidden="true">
      {logo && !failed ? (
        <Image
          src={logo}
          alt=""
          width={40}
          height={40}
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{icon}</span>
      )}
    </span>
  );
}

export function HomelabStatus() {
  const [category, setCategory] = useState('All apps');
  const [expanded, setExpanded] = useState(false);
  const [snapshot, setSnapshot] = useState<HomelabSnapshot | null>(null);
  const [failed, setFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [now, setNow] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let polling = false;
    const refresh = async () => {
      if (polling || document.hidden) return;
      polling = true;
      setRefreshing(true);
      setNow(Date.now());
      try {
        const response = await fetch('/api/homelab/status', {
          cache: 'no-store',
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(10000),
          ]),
        });
        if (!response.ok) throw new Error('Status unavailable');
        const next = parseHomelabSnapshot(await response.json());
        if (controller.signal.aborted) return;
        setSnapshot(next);
        setFailed(false);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      } finally {
        polling = false;
        if (!controller.signal.aborted) {
          setNow(Date.now());
          setRefreshing(false);
        }
      }
    };
    const onVisible = () => {
      if (!document.hidden) void refresh();
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 60000);
    const clock = setInterval(() => setNow(Date.now()), 30000);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      controller.abort();
      clearInterval(timer);
      clearInterval(clock);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refreshKey]);

  const stale = !!snapshot && now - Date.parse(snapshot.checkedAt) > 10 * 60000;
  const historical = stale || failed;
  const responding = snapshot?.services.filter(isResponding).length ?? 0;
  const total = snapshot?.services.length ?? 0;
  const categories = [
    'All apps',
    ...new Set(snapshot?.services.map((service) => service.category)),
  ];

  const visible =
    snapshot?.services.filter(
      (service) => category === 'All apps' || category === service.category,
    ) ?? [];

  return (
    <section
      className={`${sceneStyles.scene} ${styles.scene}`}
      data-kind="status"
      data-flow={total > 28}
      aria-labelledby="homelab-status-title"
      id="homelab-status"
    >
      <div className={styles.panel}>
        <div className={styles.frame}>
          <header className={styles.heading}>
            <div>
              <h3 id="homelab-status-title">
                One little box.
                <br />
                <span>Very much alive.</span>
              </h3>
              <p>The apps on my Mac mini, answering from home.</p>
            </div>
            <div className={styles.tally}>
              {snapshot || failed ? (
                <strong>
                  {snapshot ? responding : '—'}
                  <span> / {snapshot ? total : '—'}</span>
                </strong>
              ) : (
                <span className={styles.skeletonTally} aria-hidden="true" />
              )}
              <p>
                {historical
                  ? 'responding at the last check'
                  : 'services responding'}
              </p>
            </div>
          </header>
          <div className={styles.checkBar}>
            <p className={styles.health} role="status" aria-live="polite">
              {snapshot
                ? historical
                  ? 'Showing the last check.'
                  : responding === total
                    ? 'Everything is answering.'
                    : 'Some services need a look.'
                : failed
                  ? 'The status feed is unavailable.'
                  : 'Checking in on the Mac mini…'}
            </p>
            <button
              type="button"
              aria-label={refreshing ? 'Checking…' : 'Refresh status'}
              disabled={refreshing}
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              <RefreshCw size={20} aria-hidden="true" />
              <span className={styles.refreshLabel}>
                {refreshing ? 'Checking…' : 'Refresh status'}
              </span>
            </button>
          </div>
          {!snapshot && !failed && (
            <div className={styles.skeleton} aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => (
                <div key={index} className={styles.skeletonRow}>
                  <span className={styles.skeletonIcon} />
                  <span className={styles.skeletonLines}>
                    <span />
                    <span />
                  </span>
                </div>
              ))}
            </div>
          )}
          {snapshot && (
            <>
              <button
                className={styles.appsToggle}
                type="button"
                aria-expanded={expanded}
                aria-controls="homelab-apps"
                onClick={() => {
                  setExpanded(!expanded);
                  setCategory('All apps');
                }}
              >
                {expanded ? 'Hide apps' : `Show all ${total} apps`}
                <ChevronDown size={20} aria-hidden="true" />
              </button>
              <div
                className={styles.apps}
                id="homelab-apps"
                data-expanded={expanded}
              >
                <nav
                  className={styles.filters}
                  aria-label="Filter homelab apps"
                >
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={category === item}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
                <select
                  className={styles.categorySelect}
                  aria-label="Filter homelab apps"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <div
                  className={styles.services}
                  data-wide={visible.length > 21}
                >
                  {visible.map((service) => (
                    <article key={service.name} className={styles.service}>
                      <a
                        className={styles.serviceLink}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${service.name}${service.access === 'Tailscale' ? ' (requires Tailscale)' : ''} (opens in a new tab)`}
                        title={service.description}
                      >
                        <ServiceLogo
                          key={service.logo}
                          logo={service.logo}
                          icon={service.icon}
                        />
                        <div className={styles.serviceCopy}>
                          <div className={styles.serviceName}>
                            <h4>{service.name}</h4>
                            {service.access === 'Tailscale' && (
                              <Lock
                                className={styles.privateLock}
                                size={18}
                                role="img"
                                aria-label="Private service"
                              />
                            )}
                          </div>
                          <span
                            className={styles.badge}
                            data-tone={
                              historical
                                ? 'unknown'
                                : isResponding(service)
                                  ? 'ok'
                                  : 'warn'
                            }
                          >
                            <span aria-hidden="true" />
                            {historical
                              ? `Last: ${service.status.toLowerCase()}`
                              : service.status}
                          </span>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
          <footer className={styles.footer}>
            <p>
              Private apps need Tailscale or sign-in. Status updates every
              minute.
            </p>
            {snapshot && (
              <p>
                Last checked{' '}
                <time dateTime={snapshot.checkedAt}>
                  {new Date(snapshot.checkedAt).toLocaleString('en-GB', {
                    timeZone: 'Asia/Taipei',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  Taipei
                </time>
              </p>
            )}
            {historical && (
              <p className={styles.notice}>
                {failed
                  ? 'Couldn’t refresh. These are the last known results.'
                  : 'This check is over 10 minutes old. Current status is unknown.'}
              </p>
            )}
          </footer>
        </div>
      </div>
    </section>
  );
}
