import { useState } from 'react'
import { APP_CREATOR, APP_GITHUB_URL, APP_GITHUB_USER, APP_VERSION } from '../appInfo'
import { Button } from './Button'
import { CheckIcon, DownloadIcon, ShareIcon } from './Icons'
import { Modal } from './Modal'

interface AboutModalProps {
  installed: boolean
  isIos: boolean
  onInstall: () => void
  onClose: () => void
}

export function AboutModal({ installed, isIos, onInstall, onClose }: AboutModalProps) {
  const [page, setPage] = useState<'about' | 'news'>('about')

  return (
    <Modal
      title={page === 'about' ? 'Sobre' : 'Novidades'}
      subtitle={
        page === 'about'
          ? 'Blefaê — descubra quem está blefando.'
          : `Atualizações da versão ${APP_VERSION}`
      }
      onClose={onClose}
      className="modal--about"
      footer={
        <div className="modal__actions">
          {page === 'news' ? (
            <Button variant="ghost" onClick={() => setPage('about')}>
              VOLTAR
            </Button>
          ) : null}
          <Button block={page === 'about'} onClick={onClose}>
            FECHAR
          </Button>
        </div>
      }
    >
      {page === 'about' ? (
        <>
          <div className="about__brand">
            <img
              className="about__logo"
              src="/brand/logo-icon.png"
              alt="Blefaê"
              width={58}
              height={58}
            />
            <div className="about__brand-copy">
              <p className="about__name">Blefaê</p>
              <p className="about__version">Versão {APP_VERSION}</p>
            </div>
          </div>

          <dl className="about__list">
            <div className="about__row">
              <dt className="about__label">Criador do app</dt>
              <dd className="about__value">{APP_CREATOR}</dd>
            </div>
            <div className="about__row">
              <dt className="about__label">GitHub</dt>
              <dd className="about__value">
                <a
                  className="about__link"
                  href={APP_GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {APP_GITHUB_USER}
                </a>
              </dd>
            </div>
            <div className="about__row">
              <dt className="about__label">Versão atual</dt>
              <dd className="about__value">{APP_VERSION}</dd>
            </div>
          </dl>

          <div className="about__install">
            <p className="about__install-title">Instalar o app</p>
            <p className="about__install-text">
              {installed
                ? 'O Blefaê já está instalado neste dispositivo.'
                : isIos
                  ? 'No iPhone ou iPad, adicione à Tela de Início pelo menu Compartilhar do Safari.'
                  : 'Instale para abrir em tela cheia e jogar até sem internet.'}
            </p>

            {installed ? (
              <p className="about__installed">
                <CheckIcon size={16} />
                Instalado
              </p>
            ) : (
              <Button
                block
                icon={isIos ? <ShareIcon size={18} /> : <DownloadIcon size={18} />}
                onClick={onInstall}
              >
                {isIos ? 'COMO INSTALAR' : 'INSTALAR O APP'}
              </Button>
            )}
          </div>

          <Button variant="ghost" block onClick={() => setPage('news')}>
            VER NOVIDADES
          </Button>
        </>
      ) : (
        <div className="about__news">
          <div className="about__news-release">
            <span className="about__news-version">{APP_VERSION}</span>
            <span className="about__news-date">7 de novembro de 2026</span>
          </div>

          <section className="about__news-section">
            <h3>Novidades</h3>
            <ul>
              <li>Nova tela inicial com lobby visual para jogadores, baralho ativo e número de rodadas.</li>
              <li>Navegação inferior com Início, Baralhos, Histórico e Regras.</li>
              <li>Histórico local das partidas finalizadas, sem necessidade de conta ou servidor.</li>
              <li>Doze avatares de animais atribuídos aos jogadores e mantidos durante toda a partida.</li>
              <li>Menu lateral com configurações da partida, tema visual e informações sobre o app.</li>
              <li>Contagem de palavras disponível diretamente no card do baralho.</li>
              <li>Interface reposicionada para ocupar toda a tela, sem moldura externa ou conteúdo duplicado.</li>
            </ul>
          </section>

          <section className="about__news-section">
            <h3>Correções</h3>
            <ul>
              <li>Corrigido o início acidental direto no lobby, sem passar pela tela inicial.</li>
              <li>Corrigido o retorno ao layout antigo ao iniciar uma nova partida.</li>
              <li>Corrigida a inconsistência entre os animais exibidos no lobby e na partida.</li>
              <li>Corrigido o menu que não apresentava suas opções ao ser aberto.</li>
              <li>Preservadas as melhorias anteriores de responsividade, edição de jogadores, ordem de fala e palpites compostos.</li>
            </ul>
          </section>
        </div>
      )}
    </Modal>
  )
}
