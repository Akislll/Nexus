import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button.tsx";
import { Loader } from "../../../../components/Loader/Loader.tsx";
import { usePageTitle } from "../../../../hooks/usePageTitle.tsx";
import { request } from "../../../../utils/api.ts";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider.tsx";
import { IConversation } from "../../../messaging/components/Conversations/Conversations.tsx";
import { IConnection } from "../../../networking/components/Connection/Connection.tsx";
import { useWebSocket } from "../../../ws/WebSocketContextProvider.tsx";
import { LeftSidebar } from "../../components/LeftSidebar/LeftSidebar.tsx";
import { Madal } from "../../components/Modal/Modal.tsx";
import { IPost, Post } from "../../components/Post/Post.tsx";
import { RightSidebar } from "../../components/RightSidebar/RightSidebar.tsx";
import classes from "./Feed.module.scss";

interface IMetricCardProps {
  label: string;
  value: string | number;
  hint: string;
}

function MetricCard({ label, value, hint }: IMetricCardProps) {
  return (
    <div className={classes.metricCard}>
      <span className={classes.metricLabel}>{label}</span>
      <strong className={classes.metricValue}>{value}</strong>
      <span className={classes.metricHint}>{hint}</span>
    </div>
  );
}

export function Feed() {
  usePageTitle("Nexus Pulse");

  const [showPostingModal, setShowPostingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insights, setPosts] = useState<IPost[]>([]);
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [error, setError] = useState("");

  const { user } = useAuthentication();
  const navigate = useNavigate();
  const ws = useWebSocket();

  useEffect(() => {
    const fetchInsights = async () => {
      return new Promise<void>((resolve) => {
        request<IPost[]>({
          endpoint: "/api/v1/feed",
          onSuccess: (data) => {
            if (data.length > 0) {
              setPosts(data);
              resolve();
              return;
            }

            request<IPost[]>({
              endpoint: "/api/v1/feed/posts",
              onSuccess: (allPosts) => {
                setPosts(allPosts);
                resolve();
              },
              onFailure: (message) => {
                setError(message);
                resolve();
              },
            });
          },
          onFailure: () => {
            request<IPost[]>({
              endpoint: "/api/v1/feed/posts",
              onSuccess: (allPosts) => {
                setPosts(allPosts);
                resolve();
              },
              onFailure: (message) => {
                setError(message);
                resolve();
              },
            });
          },
        });
      });
    };

    const fetchDashboardData = async () => {
      setLoading(true);

      await Promise.all([
        fetchInsights(),
        new Promise<void>((resolve) => {
          request<IConnection[]>({
            endpoint: "/api/v1/networking/connections?userId=" + user?.id,
            onSuccess: (data) => {
              setConnections(data);
              resolve();
            },
            onFailure: () => resolve(),
          });
        }),
        new Promise<void>((resolve) => {
          request<IConversation[]>({
            endpoint: "/api/v1/messaging/conversations",
            onSuccess: (data) => {
              setConversations(data);
              resolve();
            },
            onFailure: () => resolve(),
          });
        }),
      ]);

      setLoading(false);
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  useEffect(() => {
    const subscription = ws?.subscribe(`/topic/feed/${user?.id}/post`, (data) => {
      const post = JSON.parse(data.body);
      setPosts((current) => [post, ...current]);
    });

    return () => subscription?.unsubscribe();
  }, [user?.id, ws]);

  const handlePost = async (data: FormData) => {
    await request<IPost>({
      endpoint: "/api/v1/feed/posts",
      method: "POST",
      contentType: "multipart/form-data",
      body: data,
      onSuccess: (created) => {
        setPosts((current) => [created, ...current]);
        setError("");
      },
      onFailure: (message) => setError(message),
    });
  };

  const acceptedConnections = useMemo(
    () => connections.filter((connection) => connection.status === "ACCEPTED").length,
    [connections]
  );

  const unreadMessages = useMemo(
    () =>
      conversations.reduce(
        (acc, conversation) =>
          acc +
          conversation.messages.filter(
            (message) => message.sender.id !== user?.id && !message.isRead
          ).length,
        0
      ),
    [conversations, user?.id]
  );

  const visualInsights = useMemo(
    () => insights.filter((item) => !!item.picture).length,
    [insights]
  );

  const latestInsight = insights.length > 0 ? insights[0] : null;

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <LeftSidebar user={user} />
      </div>

      <div className={classes.center}>
        <section className={classes.composerSection}>
          <div className={classes.posting}>
            <button
              type="button"
              onClick={() => {
                navigate(`/profile/${user?.id}`);
              }}
            >
              <img
                className={`${classes.top} ${classes.avatar}`}
                src={
                  user?.profilePicture
                    ? `${import.meta.env.VITE_API_URL}/api/v1/storage/${user?.profilePicture}`
                    : "/avatar.svg"
                }
                alt=""
              />
            </button>

            <div className={classes.composeContent}>
              <div className={classes.composeTitle}>Share a signal with your Nexus circle</div>
              <div className={classes.composeSubtitle}>
                Publish a concise update, visual note, or deeper professional insight with a
                distinct Nexus voice.
              </div>
            </div>

            <Button outline onClick={() => setShowPostingModal(true)}>
              Create insight
            </Button>
          </div>

          <Madal
            title="Create an insight"
            onSubmit={handlePost}
            showModal={showPostingModal}
            setShowModal={setShowPostingModal}
          />
        </section>

        <section className={classes.hero}>
          <div className={classes.heroContent}>
            <span className={classes.kicker}>Nexus v2 dashboard</span>
            <h1>Build professional momentum with people, ideas, and timely insights.</h1>
            <p>
              Nexus is designed as a distinct professional social platform with a modern
              dashboard-first experience, clearer information hierarchy, and faster action points
              for discovery, publishing, and collaboration.
            </p>

            <div className={classes.heroActions}>
              <Button onClick={() => setShowPostingModal(true)}>Share an insight</Button>
              <Button outline onClick={() => navigate(`/profile/${user?.id}`)}>
                View your space
              </Button>
            </div>
          </div>

          <div className={classes.heroPanel}>
            <div className={classes.heroPanelHeader}>Today on Nexus</div>

            <div className={classes.heroPanelBody}>
              <div>
                <span className={classes.panelLabel}>Circle strength</span>
                <strong>{acceptedConnections}</strong>
              </div>
              <div>
                <span className={classes.panelLabel}>Unread threads</span>
                <strong>{unreadMessages}</strong>
              </div>
              <div>
                <span className={classes.panelLabel}>Published insights</span>
                <strong>{insights.length}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={classes.metrics}>
          <MetricCard
            label="Published insights"
            value={insights.length}
            hint="Your latest ideas shared with the community"
          />
          <MetricCard
            label="Trusted allies"
            value={acceptedConnections}
            hint="Accepted relationships inside your Circle"
          />
          <MetricCard
            label="Unread threads"
            value={unreadMessages}
            hint="Conversations that may need your reply"
          />
          <MetricCard
            label="Visual stories"
            value={visualInsights}
            hint="Insights that include media for stronger reach"
          />
        </section>

        <section className={classes.dailyThought}>
          <h2>Daily Thought</h2>
          <p>“Small improvements daily lead to massive growth.”</p>
        </section>

        {latestInsight ? (
          <section className={classes.highlight}>
            <div>
              <span className={classes.highlightLabel}>Featured insight</span>
              <h2>Recent activity from your Pulse</h2>
              <p>Stay current with the newest professional update shared across your Pulse.</p>
            </div>

            <Button outline onClick={() => navigate(`/insights/${latestInsight.id}`)}>
              Open featured insight
            </Button>
          </section>
        ) : null}

        {error && <div className={classes.error}>{error}</div>}

        {loading ? (
          <Loader isInline />
        ) : (
          <div className={classes.feed}>
            {insights.map((post) => (
              <Post key={post.id} post={post} setPosts={setPosts} />
            ))}

            {insights.length === 0 && (
              <div className={classes.emptyState}>
                <h3>No insights available yet</h3>
                <p>Be the first to publish one and start the conversation.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={classes.right}>
        <RightSidebar />
      </div>
    </div>
  );
}